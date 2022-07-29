// Fill out your copyright notice in the Description page of Project Settings.


#include "BasicPlayer.h"
#include "Camera/CameraComponent.h"
#include "CPizza.h"
#include "Interactable.h"
#include "Blueprint/UserWidget.h"
#include "DrawDebugHelpers.h"

FHitResult* DoRayCast();

// Sets default values
ABasicPlayer::ABasicPlayer()
{
 	// Set this character to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	Camera = CreateDefaultSubobject<UCameraComponent>("Camera");
	Camera->SetupAttachment(RootComponent);

	_Focused = "";
	_Pizza = nullptr;
	_ThisHUD = nullptr;
	PlayerHUDClass = nullptr;
}

// Called when the game starts or when spawned
void ABasicPlayer::BeginPlay()
{
	Super::BeginPlay();

	if (PlayerHUDClass)
	{
		APlayerController* Con = GetController<APlayerController>();
		check(Con);
		_ThisHUD = CreateWidget<UPlayerUI>(Con, PlayerHUDClass);
		check(_ThisHUD);
		_ThisHUD->AddToPlayerScreen();
	}
	
}

// Called every frame
void ABasicPlayer::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	// This uses a new so we have to free the memory later.
	FHitResult* hit = new FHitResult();

	// See our View. 
	DoRayCast(hit);

	if (hit->GetActor())
	{
		AActor* OurHit = hit->GetActor();
		if (OurHit->ActorHasTag(TEXT("Interactable")))
		{
			TArray InteractableComponentsArray = OurHit->GetComponentsByTag(UInteractable::StaticClass(), FName("Interactable"));

			for (UActorComponent* it : InteractableComponentsArray)
			{
				Cast<UInteractable>(it)->OnView();
			}
		}
	}
	else
	{
		_Focused = "";
	}

	if (_ThisHUD != nullptr)
	{
		_ThisHUD->SetText(_Focused);
	}

	// Free the memory.
	delete(hit);
}

// Called to bind functionality to input
void ABasicPlayer::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
	Super::SetupPlayerInputComponent(PlayerInputComponent);

	InputComponent->BindAxis("MoveForward", this, &ABasicPlayer::MoveForward);
	InputComponent->BindAxis("MoveRight", this, &ABasicPlayer::MoveRight);
	InputComponent->BindAxis("AimRight", this, &ABasicPlayer::AddControllerYawInput);
	InputComponent->BindAxis("AimDown", this, &ABasicPlayer::LookUp);

	InputComponent->BindAction("Interact", IE_Pressed ,this, &ABasicPlayer::Interact);

}

void ABasicPlayer::MoveForward(float Value)
{
	if (Value)
	{
		AddMovementInput(GetActorForwardVector(), Value);
	}
}

void ABasicPlayer::LookUp(float Value)
{
	if (Value)
	{
		//UE_LOG(LogClass, Log, TEXT("Rotation %d"), Value);
		AddActorLocalRotation(FRotator(-Value, 0, 0));
	}
}

void ABasicPlayer::MoveRight(float Value)
{
	if (Value)
	{
		AddMovementInput(GetActorRightVector(), Value);
	}
}

void ABasicPlayer::TurnHead(float Value)
{
	if (Value)
	{

	}
}

void ABasicPlayer::Interact(void)
{
	FHitResult* hit = new FHitResult();
	DoRayCast(hit);

	if (hit->GetActor())
	{
		AActor* OurHit = hit->GetActor();
		if (OurHit->ActorHasTag(TEXT("Interactable")))
		{
			TArray InteractableComponentsArray = OurHit->GetComponentsByTag(UInteractable::StaticClass(), FName("Interactable"));

			for (UActorComponent* it : InteractableComponentsArray)
			{
				Cast<UInteractable>(it)->OnInteract();
			}
		}
	}
}

CPizza* ABasicPlayer::GetHeldPizza()
{
	return _Pizza;
}

void ABasicPlayer::ReceivePizza(CPizza* Pizza)
{
	_Pizza = Pizza;
}

void ABasicPlayer::DoRayCast(FHitResult* hit)
{

	FVector Start = GetActorLocation();
	FVector Forward = Camera->GetForwardVector();
	Start = FVector(Start.X + (Forward.X * 100), Start.Y + (Forward.Y * 100), Start.Z + (Forward.Z * 100));
	FVector End = (Forward * 1000.0f) + Start;

	if (GetWorld())
	{
		bool ActorHit = GetWorld()->LineTraceSingleByChannel(*hit, Start, End, ECC_Pawn, FCollisionQueryParams(), FCollisionResponseParams());
	}
}
