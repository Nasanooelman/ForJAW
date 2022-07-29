// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Interactable.h"
#include "PizzaBaser.generated.h"


UCLASS( ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class SALAMISAM_API UPizzaBaser : public UInteractable
{
	GENERATED_BODY()

private:
	bool bIsCookingPizza;

public:	
	// Sets default values for this component's properties
	UPizzaBaser();

protected:
	// Called when the game starts
	virtual void BeginPlay() override;

public:	
	// Called every frame
	virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

	virtual void OnView() override;

	virtual void OnInteract() override;
};
