// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "PlayerUI.h"
#include "GameFramework/Character.h"
#include "BasicPlayer.generated.h"


class UInteractable;
class CPizza;
class UCameraComponent;
class UPlayerUI;

UCLASS()
class SALAMISAM_API ABasicPlayer : public ACharacter
{
	GENERATED_BODY()

public:
	// Sets default values for this character's properties
	ABasicPlayer();
	CPizza* GetHeldPizza(void);
	void ReceivePizza(CPizza* Pizza);
	FString GetFocused() { return _Focused; }
	void SetFocused(FString focused) { _Focused = focused; }
	int Score;

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;
	//virtual void EndPlay(const EEndPlayerReason::Type EndPlayReason) override;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;

	// Called to bind functionality to input
	virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

	UPROPERTY(EditAnywhere)
	TSubclassOf<class UPlayerUI> PlayerHUDClass;

	UPROPERTY()
	class UPlayerUI* _ThisHUD;

private:

	void MoveForward(float value);
	void MoveRight(float value);
	void TurnHead(float Value);
	void LookUp(float Value);
	void Interact(void);
	void DoRayCast(FHitResult* hit);
	FString _Focused;

	CPizza* _Pizza;
	UCameraComponent* Camera;
public:
	void DropPizza() { _Pizza = nullptr; }
};
